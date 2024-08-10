"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1710374322631 = void 0;
class Migrations1710374322631 {
    constructor() {
        this.name = 'Migrations1710374322631';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "kyc_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedDate" TIMESTAMP DEFAULT now(), "imageurl" character varying, "filekey" character varying, "otherFile" jsonb, CONSTRAINT "PK_02e49877f1578e6285f84e57ab6" PRIMARY KEY ("id")); COMMENT ON COLUMN "kyc_documents"."otherFile" IS 'includes NIN file, Drivers License,PVC etc'`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_level_kyclevel_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "kyc_level" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedDate" TIMESTAMP DEFAULT now(), "bvn" character varying, "bvnVerificationCount" integer NOT NULL DEFAULT '0', "verifiedBvn" boolean NOT NULL DEFAULT false, "kyclevel" "public"."kyc_level_kyclevel_enum" NOT NULL DEFAULT '0', "Kyc3Status" character varying NOT NULL DEFAULT 'Not_initiated', "comment" character varying, "adminId" character varying, "kycdocumentsId" uuid, CONSTRAINT "REL_b723791c4d90d558de61ea3525" UNIQUE ("kycdocumentsId"), CONSTRAINT "PK_abe449e2a7f4f2b73e8d30e8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('Male', 'Female', 'Other')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedDate" TIMESTAMP DEFAULT now(), "address" character varying, "dateOfBirth" character varying, "email" character varying, "lastName" character varying, "gender" "public"."user_gender_enum", "firstName" character varying, "otherName" character varying, "state" character varying, "phoneNumber" character varying, "password" character varying, "lga" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "kycLevelId" uuid, CONSTRAINT "REL_7220a2f1a596ddedb0a1054bae" UNIQUE ("kycLevelId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKey" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "message" character varying, "serviceName" character varying, "clientUrl" character varying, "usage" jsonb, "isTestKey" boolean NOT NULL DEFAULT false, "authToken" character varying, "creatorId" uuid, CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bvn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedDate" TIMESTAMP DEFAULT now(), "bvn" character varying NOT NULL, "bvnData" text NOT NULL, "isValid" boolean NOT NULL DEFAULT false, "validityPercentage" integer NOT NULL DEFAULT '0', "userId" uuid, CONSTRAINT "PK_6a435bc468d0c622188750e3a41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "createdDate" TIMESTAMP DEFAULT now(), "lastModifiedBy" character varying, "lastModifiedDate" TIMESTAMP DEFAULT now(), "otp" character varying NOT NULL, "type" character varying NOT NULL, "phoneNumber" character varying, "usage" character varying NOT NULL, "expirationTime" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'unused', CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kyc_level" ADD CONSTRAINT "FK_b723791c4d90d558de61ea35256" FOREIGN KEY ("kycdocumentsId") REFERENCES "kyc_documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7220a2f1a596ddedb0a1054baea" FOREIGN KEY ("kycLevelId") REFERENCES "kyc_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_keys" ADD CONSTRAINT "FK_9d6d5324341f46380eb91d8167d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bvn" ADD CONSTRAINT "FK_d45682ffa0225647ddfb930ddc8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bvn" DROP CONSTRAINT "FK_d45682ffa0225647ddfb930ddc8"`);
        await queryRunner.query(`ALTER TABLE "api_keys" DROP CONSTRAINT "FK_9d6d5324341f46380eb91d8167d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7220a2f1a596ddedb0a1054baea"`);
        await queryRunner.query(`ALTER TABLE "kyc_level" DROP CONSTRAINT "FK_b723791c4d90d558de61ea35256"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "bvn"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "kyc_level"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_level_kyclevel_enum"`);
        await queryRunner.query(`DROP TABLE "kyc_documents"`);
    }
}
exports.Migrations1710374322631 = Migrations1710374322631;
//# sourceMappingURL=1710374322631-casha-migrations.js.map