import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'Skill không được để trống', })
    @IsArray({ message: "Skill có định dạng là array" })
    //each: true kiểm tra từng phần tử trong array có phải là string không
    @IsString({ each: true, message: "Skill định dạng là String" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'Salary không được để trống', })
    salary: number;

    @IsNotEmpty({ message: 'Quantity không được để trống', })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống', })
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống', })
    description: string;

    @IsDate({ message: "startDate có định dạng là Date" })
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty({ message: 'StartDate không được để trống', })
    startDate: Date;

    @IsDate({ message: "endDate có định dạng là Date" })
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty({ message: 'EndDate không được để trống', })
    endDate: Date;

    @IsNotEmpty({ message: 'IsActive không được để trống', })
    @IsBoolean({message: "isActive có định dạng là boolean"})
    isActive: boolean;
}
