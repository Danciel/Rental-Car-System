package com.swb.userservice.repositories;

import com.swb.userservice.entities.Role;
import com.swb.userservice.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}