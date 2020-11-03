using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SunApp.Core.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace SunApp.Data.Mapping.Users
{
    public class UserInfoMap : EntityTypeConfiguration<UserInfo>
    {
        #region Methods

        /// <summary>
        /// Configures the entity
        /// </summary>
        /// <param name="builder">The builder to be used to configure the entity</param>
        public override void Configure(EntityTypeBuilder<UserInfo> builder)
        {
            builder.ToTable(nameof(UserInfo));
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserName).HasMaxLength(500);
            builder.Property(x => x.Active).IsRequired();
            builder.Property(x => x.Deleted).IsRequired();
            builder.Property(x => x.IsSystemAccount).IsRequired();
            builder.Property(x => x.CreatedOnUtc).IsRequired();
            builder.Property(x => x.FailedLoginAttempts).IsRequired();
            builder.Property(x => x.PictureId).IsRequired();

            base.Configure(builder);
        }

        #endregion
    }
}
