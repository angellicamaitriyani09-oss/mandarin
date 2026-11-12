import pygame
import random

class Enemy(pygame.sprite.Sprite):
    def __init__(self, SCREEN_WIDTH, y, sprite_sheet, scale):
        pygame.sprite.Sprite.__init__(self)
        
        # Pengaturan animasi
        self.animation_list = []
        self.frame_index = 0
        self.update_time = pygame.time.get_ticks()
        
        frame_width = 24
        frame_height = 24
        for animation_steps in range(sprite_sheet.get_width() // frame_width):
            image = sprite_sheet.subsurface(
                (animation_steps * frame_width, 0, frame_width, frame_height)
            ).copy()
            if scale != 1:
                image = pygame.transform.scale(
                    image, (int(frame_width * scale), int(frame_height * scale))
                )
            self.animation_list.append(image)
            
        self.image = self.animation_list[self.frame_index]
        self.rect = self.image.get_rect()
        
        # Menentukan dari arah mana burung muncul (kiri atau kanan layar)
        self.direction = random.choice([-1, 1])
        if self.direction == 1:
            self.flip = False
            self.rect.x = 0 - self.rect.width # Muncul dari luar batas kiri
        else:
            self.flip = True
            self.rect.x = SCREEN_WIDTH # Muncul dari luar batas kanan
            
        self.rect.y = y
        
        # Membuat mask untuk deteksi tabrakan yang presisi (pixel-perfect)
        self.mask = pygame.mask.from_surface(self.image)
        
        # Kecepatan terbang acak
        self.speed = random.randint(2, 4)

    def update(self, scroll, SCREEN_WIDTH):
        # Update timer untuk ganti frame animasi
        ANIMATION_COOLDOWN = 100
        
        # Update gambar animasi saat cooldown tercapai
        if pygame.time.get_ticks() - self.update_time > ANIMATION_COOLDOWN:
            self.update_time = pygame.time.get_ticks()
            self.frame_index += 1
            
        # Reset animasi kembali ke awal jika sudah mencapai frame terakhir
        if self.frame_index >= len(self.animation_list):
            self.frame_index = 0

        # Menghadap sesuai arah terbang
        if self.flip:
            self.image = pygame.transform.flip(self.animation_list[self.frame_index], True, False)
        else:
            self.image = self.animation_list[self.frame_index]

        # Update pergerakan posisi
        self.rect.x += self.direction * self.speed
        self.rect.y += scroll
        
        # Update mask berdasarkan frame gambar saat ini untuk tabrakan
        self.mask = pygame.mask.from_surface(self.image)

        # Hapus instance enemy (kill) jika terbang melewati batas layar 
        # atau jatuh di bawah layar untuk menghemat memori
        if self.rect.right < 0 or self.rect.left > SCREEN_WIDTH or self.rect.top > 600:
            self.kill()