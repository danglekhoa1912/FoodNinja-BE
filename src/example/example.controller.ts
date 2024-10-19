import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { InsertExampleDto } from './dto';

@Controller('example')
export class ExampleController {
  @Get()
  getExample(@GetUser('id') userId: string) {
    return userId;
  }

  @Get(':id')
  getExampleById(@Param('id') exampleId: string) {
    return exampleId;
  }

  @Post()
  insertExample(
    @GetUser('id') userId: string,
    @Body() insertExampleDto: InsertExampleDto,
  ) {
    return insertExampleDto;
  }

  @Patch()
  updateExample(@Param('id') exampleId: string, @Body() updateExampleDto: any) {
    return updateExampleDto;
  }

  @Delete()
  deleteExample(@Param('id') exampleId: string) {
    return exampleId;
  }
}
