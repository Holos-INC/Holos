package com.HolosINC.Holos.auth.payload.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequest {
	
	@NotBlank
	private String username;
	
	@NotBlank
	private String authority;

	@NotBlank
	private String password;
	
	@NotBlank
	private String firstName;

	@NotBlank
	private String email;

	@NotBlank
	private String phoneNumber;

	// @NotBlank
	private MultipartFile imageProfile;

    private MultipartFile tableCommisionsPrice;

    private String description;

    private String linkToSocialMedia;
}
