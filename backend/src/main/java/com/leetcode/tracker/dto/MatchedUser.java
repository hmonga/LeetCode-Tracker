package com.leetcode.tracker.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MatchedUser {
    private String username;
    private SubmitStats submitStats;
    
    @Data
    public static class SubmitStats {
        private List<AcSubmissionNum> acSubmissionNum;
    }
    
    @Data
    public static class AcSubmissionNum {
        private String difficulty;
        private Integer count;
        private Integer submissions;
    }
}

