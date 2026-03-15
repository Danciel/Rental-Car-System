package com.swd.rentalcar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.swd.rentalcar", "com.swb.common"})
public class RentalcarApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalcarApplication.class, args);
	}

}
