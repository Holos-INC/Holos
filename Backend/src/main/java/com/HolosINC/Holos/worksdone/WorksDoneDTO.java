package com.HolosINC.Holos.worksdone;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WorksDoneDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private byte[] image;
    // TODO Send artist as well pls

    public WorksDone createWorksDone() {
        WorksDone work = new WorksDone();
        work.setName(this.getName());
        work.setDescription(this.getDescription());
        work.setPrice(this.getPrice());
        work.setImage(this.getImage());
        return work;
    }

    public static WorksDoneDTO createDTO(WorksDone worksDone) {
        WorksDoneDTO dto = new WorksDoneDTO();
        dto.setId(worksDone.getId());
        dto.setName(worksDone.getName());
        dto.setDescription(worksDone.getDescription());
        dto.setPrice(worksDone.getPrice());
        dto.setImage(worksDone.getImage());
        return dto;
    }
}
