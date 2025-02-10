using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace itFixAPI.Migrations
{
    /// <inheritdoc />
    public partial class datumproizvod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DatumDodavanja",
                table: "Proizvodi",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DatumDodavanja",
                table: "Proizvodi");
        }
    }
}
