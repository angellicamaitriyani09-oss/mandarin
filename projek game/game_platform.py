import pygame
import random

class Platform(pygame.sprite.Sprite):
    # Menambahkan platform_image sebagai parameter agar bisa memanggil gambar dari file utama
    def __init__(self, x, y, width, moving, platform_image):
        pygame.sprite.Sprite.__init__(self)
        
        # Menyesuaikan ukuran gambar platform
        self.image = pygame.transform.scale(platform_image, (width, 10))
        self.moving = moving
        self.move_counter = random.randint(0, 50)
        self.direction = random.choice([-1, 1])
        
        # PERBAIKAN: Menambahkan variabel speed yang hilang di kode asli Anda
        self.speed = random.randint(1, 2) 
        
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y

    # Menambahkan SCREEN_WIDTH dan SCREEN_HEIGHT ke parameter
    def update(self, scroll, SCREEN_WIDTH, SCREEN_HEIGHT):
        # Logika pergerakan horizontal untuk platform yang bergerak
        if self.moving == True:
            self.move_counter += 1
            self.rect.x += self.direction * self.speed
            
        # Mengubah arah jika mencapai batas pergerakan atau menabrak tepi layar
        if self.move_counter >= 100 or self.rect.left < 0 or self.rect.right > SCREEN_WIDTH:
            self.direction *= -1
            self.move_counter = 0
            
        # Platform ikut bergeser ke bawah saat pemain melompat naik (efek scroll)
        self.rect.y += scroll
        
        # Menghancurkan objek platform jika sudah keluar dari layar bawah untuk menghemat memori
        if self.rect.top > SCREEN_HEIGHT:
            self.kill()