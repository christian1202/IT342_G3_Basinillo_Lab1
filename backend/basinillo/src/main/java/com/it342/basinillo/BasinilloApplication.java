package com.it342.basinillo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BasinilloApplication {

	public static void main(String[] args) {
		SpringApplication.run(BasinilloApplication.class, args);
	}

}
