import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MedicamentService } from './medicament.service';
import { CreateMedicamentDto } from './dto/create-medicament.dto';
import { UpdateMedicamentDto } from './dto/update-medicament.dto';

@Controller('medicament')
export class MedicamentController {
  constructor(private readonly medicamentService: MedicamentService) {}

  @Post('add')
  async AddMedicament(@Body() medicament:CreateMedicamentDto){
    return this.medicamentService.AddMedicament(medicament);
  }
  @Get('listes')
  async getAllMedicament(){
    return this.medicamentService.getAllMedicament();
  }
  @Get('detail/:id')
  async getMedicament(@Param('id') id: string){
    return this.medicamentService.getMedicamentById(id);
  }
  
  @Put('updat/:id')
  async UpdateMedicament(
    @Param('id') id: string,
    @Body() updateMedicamentDto: UpdateMedicamentDto
  ) {
    return this.medicamentService.UpdateMedicament(id, updateMedicamentDto);
  }

  @Post('categories/seed')
  async seedCategories() {
    return this.medicamentService.seedCategories();
  }

  @Get('categories')
  async getAllCategories() {
    return this.medicamentService.getAllCategories();
  }

  @Delete('delet/:id')
  async deletMedicament(@Param('id') id: string){
    return this.medicamentService.deletMedicament(id);
  }

}
