package com.HolosINC.Holos.worksdone;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WorksDoneDTO {
    
    private Long id;
    private String name;
    private String description;
    private Double price;
    private byte[] image;
    private Long artistId;
    private Long baseUserId;
    private String artistName;
    private String artistSurname;

    public static WorksDoneDTO createDTO(WorksDone worksDone) {
        WorksDoneDTO dto = new WorksDoneDTO();
        dto.setId(worksDone.getId());
        dto.setName(worksDone.getName());
        dto.setDescription(worksDone.getDescription());
        dto.setPrice(worksDone.getPrice());
        dto.setImage(worksDone.getImage());
        return dto;
    }

    public WorksDone createWorksDone() {
        WorksDone worksDone = new WorksDone();
        worksDone.setName(this.name);
        worksDone.setDescription(this.description);
        worksDone.setPrice(this.price);
        worksDone.setImage(this.image);
        return worksDone;
    }
}
