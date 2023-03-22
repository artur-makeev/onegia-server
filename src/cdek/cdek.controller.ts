import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { CdekService } from './cdek.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import {
	GetAddressesDto,
	GetCitiesDto,
	GetDeliveryDetailsDto,
} from './dto/cdek.dto';

@ApiTags('Cdek')
@Controller('api/cdek')
export class CdekController {
	constructor(private cdekService: CdekService) {}

	@ApiOperation({ summary: 'Cdek authorization' })
	@ApiResponse({ status: 200 })
	@Get('auth')
	auth() {
		return this.cdekService.auth();
	}

	@ApiOperation({ summary: 'get regions' })
	@ApiResponse({ status: 200 })
	@Get('regions')
	regions() {
		return this.cdekService.getRegions();
	}

	@ApiOperation({ summary: 'get cities by region' })
	@ApiResponse({ status: 200 })
	@Get('cities')
	cities(@Query() query: GetCitiesDto) {
		return this.cdekService.getCities(query);
	}

	@ApiOperation({ summary: 'get pickup locations by city' })
	@ApiResponse({ status: 200 })
	@Get('addresses')
	addresses(@Query() query: GetAddressesDto) {
		return this.cdekService.getAddresses(query);
	}

	@ApiOperation({ summary: 'get delivery details' })
	@ApiResponse({ status: 201 })
	@Post('calculate')
	calculate(@Body() body: GetDeliveryDetailsDto) {
		return this.cdekService.getDeliveryDetails(body);
	}
}
