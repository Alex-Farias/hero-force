import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || "defaultSecret",
            signOptions: { expiresIn: "1h" },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}