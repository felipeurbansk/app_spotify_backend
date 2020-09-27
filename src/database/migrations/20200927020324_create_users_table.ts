import Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('access_token').nullable();
        table.string('display_name').notNullable();
        table.string('email').notNullable();
        table.string('country').nullable();
        table.string('spotify_id').notNullable();
        table.string('url_perfil').notNullable();
        table.string('uri_perfil').notNullable();
        table.string('api_perfil').notNullable();
        table.string('image').nullable();
        table.string('product').notNullable();
        table.string('type').notNullable();
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('users');
}

