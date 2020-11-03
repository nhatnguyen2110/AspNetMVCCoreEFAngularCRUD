using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SunApp.Core.Entities.Media;
using Microsoft.EntityFrameworkCore;

namespace SunApp.Data.Mapping
{
    public partial class PictureMap : EntityTypeConfiguration<Picture>
    {
        public override void Configure(EntityTypeBuilder<Picture> builder)
        {
            builder.ToTable(nameof(Picture));
            builder.HasKey(picture => picture.Id);

            builder.Property(picture => picture.MimeType).HasMaxLength(50).IsRequired();
            builder.Property(picture => picture.OriginalFileName).HasMaxLength(500);

            base.Configure(builder);
        }
    }
}
