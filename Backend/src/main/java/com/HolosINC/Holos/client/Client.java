package com.HolosINC.Holos.client;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import com.HolosINC.Holos.model.BaseUser;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "clients")
@EqualsAndHashCode(callSuper = true)
public class Client extends BaseUser{
}
