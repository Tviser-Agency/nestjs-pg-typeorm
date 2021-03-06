import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { CrudRequest } from "@nestjsx/crud";
import { TagEntity } from "../tag/entities/tag.entity";
import { HeadingEntity } from "../heading/entities/heading.entity";
import { I18nRepository } from "typeorm-i18n";
import { UpdateResult } from "typeorm";


@Injectable()
export class PostService extends TypeOrmCrudService<PostEntity> {
  constructor(
    @InjectRepository(PostEntity) private readonly post: I18nRepository<PostEntity>,
    @InjectRepository(TagEntity) private readonly tag: I18nRepository<TagEntity>,
    @InjectRepository(HeadingEntity) private readonly heading: I18nRepository<HeadingEntity>
  ) {
    super(post);
  }

  async createOneBase(req: CrudRequest, dto: PostEntity): Promise<PostEntity> {

    if (dto.tags) {
      const tags = await this.tag.findByIds(dto.tags.toString().split(",").map(item => parseInt(item)));
      Object.assign(dto, { tags: [...tags] });
    }
    if (dto.headings) {
      const headings = await this.heading.findByIds(dto.headings.toString().split(",").map(item => parseInt(item)));
      Object.assign(dto, { headings: [...headings] });
    }

    return await this.post.save(this.post.create(dto));
  }

  async updateOneBase(req: CrudRequest, dto: PostEntity, id: number): Promise<UpdateResult> {

    if (dto.tags) {
      const tags = await this.tag.findByIds(dto.tags.toString().split(",").map(item => parseInt(item)));
      Object.assign(dto, { tags: [...tags] });
    }

    if (dto.headings) {
      const headings = await this.heading.findByIds(dto.headings.toString().split(",").map(item => parseInt(item)));
      Object.assign(dto, { headings: [...headings] });
    }

    return await this.post.update(id, { ...dto });

  }

  // create(createPostDto: CreatePostDto) {
  //   return "This action adds a new post";
  // }
  //
  // findAll() {
  //   return `This action returns all post`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }
  //
  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
