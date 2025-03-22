package com.HolosINC.Holos.auth.payload.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

	@NotBlank
	@Size(min = 3, max = 30, message = "El nombre de usuario debe tener entre 3 y 30 caracteres")
	private String username;

	@NotBlank
	@Pattern(regexp = "^(ARTIST|CLIENT)$", message = "La autoridad debe ser ARTIST o CLIENT")
	private String authority;

	@NotBlank
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número")
	private String password;

	@NotBlank
	@Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
	private String firstName;

	@NotBlank
	@Email(message = "El email no tiene un formato válido")
	private String email;

	@NotBlank
	@Pattern(regexp = "^[0-9]{9}$", message = "El número de teléfono debe tener 9 dígitos")
	private String phoneNumber;

	@NotBlank
	private MultipartFile imageProfile;
}
