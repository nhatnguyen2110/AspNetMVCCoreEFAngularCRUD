using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SunApp.Core.Entities.Media;
using Microsoft.EntityFrameworkCore;


namespace SunApp.Data.Mapping.Media
{
    public partial class PictureBinaryMap : EntityTypeConfiguration<PictureBinary>
    {
        public override void Configure(EntityTypeBuilder<PictureBinary> builder)
        {
            builder.ToTable(nameof(PictureBinary));
            builder.HasKey(pictureBinary => pictureBinary.Id);

            builder.HasOne(pictureBinary => pictureBinary.Picture)
                .WithOne(picture => picture.PictureBinary)
                .HasForeignKey<PictureBinary>(pictureBinary => pictureBinary.PictureId)
                .OnDelete(DeleteBehavior.Cascade);

            base.Configure(builder);
        }

    }
}
