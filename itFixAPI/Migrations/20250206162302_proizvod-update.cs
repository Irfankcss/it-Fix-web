using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace itFixAPI.Migrations
{
    /// <inheritdoc />
    public partial class proizvodupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BrojRecenzija",
                table: "Proizvodi",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GarancijaMjeseci",
                table: "Proizvodi",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Ocjena",
                table: "Proizvodi",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Polovan",
                table: "Proizvodi",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Popust",
                table: "Proizvodi",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrojRecenzija",
                table: "Proizvodi");

            migrationBuilder.DropColumn(
                name: "GarancijaMjeseci",
                table: "Proizvodi");

            migrationBuilder.DropColumn(
                name: "Ocjena",
                table: "Proizvodi");

            migrationBuilder.DropColumn(
                name: "Polovan",
                table: "Proizvodi");

            migrationBuilder.DropColumn(
                name: "Popust",
                table: "Proizvodi");
        }
    }
}
