package com.HolosINC.Holos.Kanban.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusKanbanUpdateDTO {

    private Long id;

    @NotBlank(message = "El campo 'nombre' es obligatorio")
    @Pattern(regexp = "^(?!\\d+$).+", message = "El campo 'nombre' no puede ser solo numérico")
    private String name;

    @NotBlank(message = "El campo 'color' no puede estar vacío")
    @Pattern(
        regexp = "^#(?:[0-9a-fA-F]{3}){1,2}$",
        message = "El campo 'color' debe ser un código hexadecimal válido (ej: #FF5733)"
    )
    private String color;

    @Size(max = 255, message = "La descripción no puede tener más de 255 caracteres")
    private String description;
}
