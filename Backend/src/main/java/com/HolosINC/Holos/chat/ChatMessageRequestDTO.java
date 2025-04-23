package com.HolosINC.Holos.chat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ChatMessageRequestDTO {
    private String text;
    private String commision;
}
