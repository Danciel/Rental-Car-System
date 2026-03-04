package com.sba301.bookingservice.repositories;

import com.sba301.bookingservice.entities.Booking;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  Optional<Booking> findByBookingCode(String bookingCode);

  List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
}

