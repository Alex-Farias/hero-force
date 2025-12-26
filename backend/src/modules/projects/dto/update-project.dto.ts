import { PartialType } from "@nestjs/mapped-types";
import { ProjectCreateDto } from "./create-project.dto";

export class ProjectUpdateDto  extends PartialType(ProjectCreateDto) {}