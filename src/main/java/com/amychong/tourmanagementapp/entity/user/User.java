package com.amychong.tourmanagementapp.entity.user;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.apache.commons.lang3.SerializationUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.Assert;

import java.io.Serializable;
import java.util.*;
import java.util.function.Function;

@Entity
@Table(name="users")
public class User implements UserDetails, Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @NotBlank(message = "Name is mandatory")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters long")
    @Column(name="name")
    private String name;

    @NotBlank(message = "Email is mandatory")
    @Size(max = 255, message = "Email should have at most 255 characters")
    @Email(message = "Email should be valid")
    @Column(name="email")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Column(name="password_hash")
    private String password;

    @NotNull(message = "Password changed date is mandatory")
    @Column(name="password_changed_date")
    private Long passwordChangedDateInMillis;

    @NotNull(message = "Active status is mandatory")
    @Column(name="active")
    private Boolean active = true;

    @NotNull(message = "Role is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private Role role;

    // define constructors
    public User() {
        super();
    }

    public User(String name, String email, String password, Long passwordChangedDateInMillis, Boolean active, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.passwordChangedDateInMillis = passwordChangedDateInMillis;
        this.active = active;
        this.role = role;
    }

    // define getters and setters

    @Override
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public Long getPasswordChangedDate() {
        return passwordChangedDateInMillis;
    }

    public void setPasswordChangedDate(Long passwordChangedDateInMillis) {
        this.passwordChangedDateInMillis = passwordChangedDateInMillis;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // deepCopy method
    public User deepCopy() {
        return SerializationUtils.clone(this);
    }

    // define toString method

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", active=" + active +
                ", role=" + role +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // custom UserBuilder

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static final class UserBuilder {

        private String name;
        private String username;
        private String password;
        private Long passwordChangedDateInMillis;
        private List<GrantedAuthority> authorities = new ArrayList<>();
        private boolean disabled = false;

        private Function<String, String> passwordEncoder = password -> password;

        private UserBuilder() {
        }

        public UserBuilder name(String name) {
            Assert.notNull(name, "name cannot be null");
            this.name = name;
            return this;
        }

        public UserBuilder username(String username) {
            Assert.notNull(username, "username cannot be null");
            this.username = username;
            return this;
        }

        public UserBuilder password(String password) {
            Assert.notNull(password, "password cannot be null");
            this.password = password;
            return this;
        }

        public UserBuilder passwordEncoder(Function<String, String> encoder) {
            Assert.notNull(encoder, "encoder cannot be null");
            this.passwordEncoder = encoder;
            return this;
        }

        public UserBuilder passwordChangedDate(Long passwordChangedDateInMillis) {
            this.passwordChangedDateInMillis = passwordChangedDateInMillis;
            return this;
        }

        public UserBuilder authorities(GrantedAuthority... authorities) {
            Assert.notNull(authorities, "authorities cannot be null");
            return this.authorities(Arrays.asList(authorities));
        }

        public UserBuilder authorities(Collection<? extends GrantedAuthority> authorities) {
            Assert.notNull(authorities, "authorities cannot be null");
            this.authorities = new ArrayList<>(authorities);
            return this;
        }

        public UserBuilder authorities(String... authorities) {
            Assert.notNull(authorities, "authorities cannot be null");
            return this.authorities(AuthorityUtils.createAuthorityList(authorities));
        }

        public UserBuilder disabled(boolean disabled) {
            this.disabled = disabled;
            return this;
        }

        public User build() {
            String encodedPassword = this.passwordEncoder.apply(this.password);
            Role role = Role.valueOf(this.authorities.get(0).getAuthority());
            return new User(this.name, this.username, encodedPassword, this.passwordChangedDateInMillis, !this.disabled, role);
        }
    }
}
