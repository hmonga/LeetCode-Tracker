package com.leetcode.tracker.dto;

import java.util.List;

public class LeetCodeStatsDTO {
    private String username;
    private Integer totalSolved;
    private Integer easySolved;
    private Integer mediumSolved;
    private Integer hardSolved;
    private Double acceptanceRate;
    private List<SubmissionDTO> recentSubmissions;

    public LeetCodeStatsDTO() {
    }

    public LeetCodeStatsDTO(String username, Integer totalSolved, Integer easySolved, Integer mediumSolved, Integer hardSolved, Double acceptanceRate, List<SubmissionDTO> recentSubmissions) {
        this.username = username;
        this.totalSolved = totalSolved;
        this.easySolved = easySolved;
        this.mediumSolved = mediumSolved;
        this.hardSolved = hardSolved;
        this.acceptanceRate = acceptanceRate;
        this.recentSubmissions = recentSubmissions;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getTotalSolved() {
        return totalSolved;
    }

    public void setTotalSolved(Integer totalSolved) {
        this.totalSolved = totalSolved;
    }

    public Integer getEasySolved() {
        return easySolved;
    }

    public void setEasySolved(Integer easySolved) {
        this.easySolved = easySolved;
    }

    public Integer getMediumSolved() {
        return mediumSolved;
    }

    public void setMediumSolved(Integer mediumSolved) {
        this.mediumSolved = mediumSolved;
    }

    public Integer getHardSolved() {
        return hardSolved;
    }

    public void setHardSolved(Integer hardSolved) {
        this.hardSolved = hardSolved;
    }

    public Double getAcceptanceRate() {
        return acceptanceRate;
    }

    public void setAcceptanceRate(Double acceptanceRate) {
        this.acceptanceRate = acceptanceRate;
    }

    public List<SubmissionDTO> getRecentSubmissions() {
        return recentSubmissions;
    }

    public void setRecentSubmissions(List<SubmissionDTO> recentSubmissions) {
        this.recentSubmissions = recentSubmissions;
    }
}

