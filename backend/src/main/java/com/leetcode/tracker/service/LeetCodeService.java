package com.leetcode.tracker.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcode.tracker.dto.LeetCodeStatsDTO;
import com.leetcode.tracker.dto.MatchedUser;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class LeetCodeService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final String LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

    public LeetCodeService() {
        this.webClient = WebClient.builder()
                .baseUrl(LEETCODE_GRAPHQL_URL)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public LeetCodeStatsDTO getUserStats(String username) {
        try {
            // Build GraphQL query
            String query = buildQuery(username);
            
            // Create request body - LeetCode GraphQL API expects just the query string
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", query);

            // Make GraphQL request
            Mono<Map> responseMono = webClient.post()
                    .uri("")
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Mozilla/5.0")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class);

            Map<String, Object> response = responseMono
                    .timeout(java.time.Duration.ofSeconds(10))
                    .doOnError(error -> {
                        System.err.println("Error calling LeetCode API: " + error.getMessage());
                        if (error instanceof WebClientResponseException) {
                            WebClientResponseException ex = (WebClientResponseException) error;
                            System.err.println("Status: " + ex.getStatusCode());
                            System.err.println("Response body: " + ex.getResponseBodyAsString());
                        }
                    })
                    .block();
            
            if (response == null) {
                throw new RuntimeException("Received null response from LeetCode API");
            }
            
            if (response.containsKey("errors")) {
                Object errors = response.get("errors");
                throw new RuntimeException("LeetCode API returned errors: " + errors.toString());
            }
            
            if (!response.containsKey("data")) {
                throw new RuntimeException("Invalid response from LeetCode API: " + response.toString());
            }

            Map<String, Object> data = (Map<String, Object>) response.get("data");
            Map<String, Object> matchedUserData = (Map<String, Object>) data.get("matchedUser");

            if (matchedUserData == null) {
                throw new RuntimeException("User not found: " + username);
            }

            // Parse the response
            LeetCodeStatsDTO stats = parseResponse(matchedUserData);
            return stats;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching LeetCode data: " + e.getMessage(), e);
        }
    }

    private String buildQuery(String username) {
        // Properly escape the username in the GraphQL query
        return String.format(
            "query { matchedUser(username: \"%s\") { username submitStats: submitStatsGlobal { acSubmissionNum { difficulty count submissions } } } }",
            username.replace("\"", "\\\"")
        );
    }

    private LeetCodeStatsDTO parseResponse(Map<String, Object> matchedUserData) {
        LeetCodeStatsDTO stats = new LeetCodeStatsDTO();
        
        String username = (String) matchedUserData.get("username");
        stats.setUsername(username);

        Map<String, Object> submitStats = (Map<String, Object>) matchedUserData.get("submitStats");
        if (submitStats != null) {
            java.util.List<Map<String, Object>> acSubmissionNum = 
                (java.util.List<Map<String, Object>>) submitStats.get("acSubmissionNum");

            if (acSubmissionNum != null) {
                for (Map<String, Object> submission : acSubmissionNum) {
                    String difficulty = (String) submission.get("difficulty");
                    Integer count = ((Number) submission.get("count")).intValue();
                    Integer submissions = ((Number) submission.get("submissions")).intValue();

                    switch (difficulty) {
                        case "All":
                            stats.setTotalSolved(count);
                            // Calculate acceptance rate: (accepted / total submissions) * 100
                            if (submissions > 0) {
                                double acceptanceRate = (count.doubleValue() / submissions.doubleValue()) * 100;
                                stats.setAcceptanceRate(Math.round(acceptanceRate * 100.0) / 100.0);
                            }
                            break;
                        case "Easy":
                            stats.setEasySolved(count);
                            break;
                        case "Medium":
                            stats.setMediumSolved(count);
                            break;
                        case "Hard":
                            stats.setHardSolved(count);
                            break;
                    }
                }
            }
        }

        // Set default values if not found
        if (stats.getTotalSolved() == null) stats.setTotalSolved(0);
        if (stats.getEasySolved() == null) stats.setEasySolved(0);
        if (stats.getMediumSolved() == null) stats.setMediumSolved(0);
        if (stats.getHardSolved() == null) stats.setHardSolved(0);
        if (stats.getAcceptanceRate() == null) stats.setAcceptanceRate(0.0);

        return stats;
    }
}

