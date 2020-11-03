using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SunApp.Core.Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace SunApp.Data.Mapping.Users
{
    public class UserPasswordMap : EntityTypeConfiguration<UserPassword>
    {
        #region Methods

        /// <summary>
        /// Configures the entity
        /// </summary>
        /// <param name="builder">The builder to be used to configure the entity</param>
        public override void Configure(EntityTypeBuilder<UserPassword> builder)
        {
            builder.ToTable(nameof(UserPassword));
            builder.HasKey(x => x.Id);
            builder.Property(x => x.PasswordFormatId).IsRequired();
            builder.Property(x => x.CreatedOnUtc).IsRequired();

            builder.HasOne(x => x.UserInfo)
                .WithMany()
                .HasForeignKey(password => password.UserId)
                .IsRequired();
            builder.Ignore(x => x.PasswordFormat);

            base.Configure(builder);
        }

        #endregion
    }
}
