package com.HolosINC.Holos.auth.payload.request;


import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UpdateRequest {
    
	private String username;
	
	private String firstName;

	private String email;

	private String phoneNumber;

	private MultipartFile imageProfile;

    private MultipartFile tableCommissionsPrice;
    
    private String description;

	private String linkToSocialMedia;

	private Integer numSlotsOfWork;
}
