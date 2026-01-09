package com.example.expensetracker.security;

import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new ServletException("Email not found from OAuth2 provider");
        }
        // String name = oAuth2User.getAttribute("name");

        // 1. Check if user exists, or create new one
        userRepository.findByUsername(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(email);
                    newUser.setPassword("OAUTH2_USER"); // Set dummy password to satisfy NOT NULL constraint if schema
                                                        // didn't update
                    return userRepository.save(newUser);
                });

        // 2. Generate JWT (We need to manually construct an Authentication object or
        // adjust tokenProvider)
        // Since tokenProvider expects an Authentication object, and we have one (the
        // OAuth token),
        // but we actually want the JWT subject to be the USERNAME (email), we should
        // make sure tokenProvider uses .getName() which maps to email for us?
        // Let's create a specific method or just ensure authentication.getName()
        // returns the email here.
        // For OAuth2, authentication.getName() usually returns the Provider ID.
        // So we might need to modify JwtTokenProvider OR create a ad-hoc token here.

        // Let's modify JwtTokenProvider to accept a String username directly, OR create
        // a simpler manual token here if possible.
        // Better: Update JwtTokenProvider to allow generating token from username.

        // For now, let's assume we can use the existing generateToken if we wrap it?
        // Actually, let's just use the email.

        // Hack: Create a manual token generation here reusing logic or just update
        // provider.
        // Let's look at JwtTokenProvider again. It uses authentication.getName().
        // For OAuth2AuthenticationToken, getName() might be the sub (ID) or email
        // depending on config.
        // Let's update `JwtTokenProvider` to have `generateTokenFromUsername(String
        // username)`.

        String token = tokenProvider.generateTokenFromUsername(email);

        // 3. Redirect to Frontend with Token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
