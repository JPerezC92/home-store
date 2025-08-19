import { ApiProperty } from "@nestjs/swagger";

export class YapeUploadResponseDto {
	@ApiProperty({
		description: "Indicates if the bulk payment upload was successful",
		example: true,
	})
	success: boolean;

	@ApiProperty({
		description: "Number of Yape payments processed in this batch",
		example: 5,
	})
	processedCount: number;
}
