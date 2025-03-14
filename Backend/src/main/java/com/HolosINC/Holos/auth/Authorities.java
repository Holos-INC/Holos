package com.HolosINC.Holos.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "authorities")
public class Authorities{
    
    @Id
	@SequenceGenerator(name = "entity_seq", sequenceName = "entity_sequence", initialValue = 500)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entity_seq")
	protected Long id;

	@Column(length = 20)
	String authority;
}