package com.leetcode.tracker.dto;

import lombok.Data;
import java.util.Map;

@Data
public class GraphQLResponse {
    private Map<String, Object> data;
    private Map<String, Object> errors;
}

