import { CreateLinkDto } from '@hs/api/links/dto/create-link.dto'
import { UpdateLinkDto } from '@hs/api/links/dto/update-link.dto'
import { Link } from '@hs/api/links/entities/link.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LinksService {
	private readonly _links: Link[] = [
		{
			id: 0,
			title: 'Docs',
			url: 'https://turborepo.com/docs',
			description:
				'Find in-depth information about Turborepo features and API.',
		},
		{
			id: 1,
			title: 'Learn',
			url: 'https://turborepo.com/docs/handbook',
			description: 'Learn more about monorepos with our handbook.',
		},
		{
			id: 2,
			title: 'Templates',
			url: 'https://turborepo.com/docs/getting-started/from-example',
			description:
				'Choose from over 15 examples and deploy with a single click.',
		},
		{
			id: 3,
			title: 'Deploy',
			url: 'https://vercel.com/new',
			description:
				'Instantly deploy your Turborepo to a shareable URL with Vercel.',
		},
	]

	create(createLinkDto: CreateLinkDto) {
		return `This action adds a new link ${createLinkDto}`
	}

	findAll() {
		return this._links
	}

	findOne(id: number) {
		return `This action returns a #${id} link`
	}

	update(id: number, updateLinkDto: UpdateLinkDto) {
		return `This action updates a #${id} link ${updateLinkDto}`
	}

	remove(id: number) {
		return `This action removes a #${id} link`
	}
}
