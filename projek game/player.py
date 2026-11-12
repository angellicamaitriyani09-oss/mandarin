import pygame

class Player():
    # Menambahkan parameter jumpy_image agar bisa menerima gambar dari file utama
    def __init__(self, x, y, jumpy_image):
        self.image = pygame.transform.scale(jumpy_image, (45, 45))
        self.width = 25
        self.height = 40
        self.rect = pygame.Rect(0, 0, self.width, self.height)
        self.rect.center = (x, y)
        self.vel_y = 0
        self.flip = False
        
    # Menambahkan parameter yang dibutuhkan dari file utama
    def move(self, platform_group, SCREEN_WIDTH, GRAVITY, SCROLL_THRESH, jump_fx):
        scroll = 0
        dx = 0
        dy = 0
        
        # Deteksi penekanan tombol
        key = pygame.key.get_pressed()
        if key[pygame.K_a]:
            dx = -10
            self.flip = False
        # PERBAIKAN TYPO: Sebelumnya tertulis pygamr.K_d
        if key[pygame.K_d]:
            dx = 10
            self.flip = True
            
        # Efek gravitasi
        self.vel_y += GRAVITY
        # PERBAIKAN TYPO: Sebelumnya tertulis self.vel.y
        dy += self.vel_y 
        
        # Mencegah pemain keluar dari batas kiri/kanan layar
        if self.rect.left + dx < 0:
            dx = -self.rect.left
        if self.rect.right + dx > SCREEN_WIDTH:
            dx = SCREEN_WIDTH - self.rect.right
            
        # Deteksi tabrakan (collision) dengan platform
        for platform in platform_group:
            if platform.rect.colliderect(self.rect.x, self.rect.y + dy, self.width, self.height):
                # Hanya memantul jika sedang jatuh (velocity_y > 0)
                if self.vel_y > 0:
                    self.rect.bottom = platform.rect.top
                    dy = 0
                    self.vel_y = -20
                    jump_fx.play()
                    
        # Logika Scroll (menggulirkan layar jika pemain melompat terlalu tinggi)
        if self.rect.top <= SCROLL_THRESH:
            if self.vel_y < 0:
                scroll = -dy
                
        # Update posisi rect
        self.rect.x += dx
        self.rect.y += dy + scroll
        
        # Update mask untuk deteksi tabrakan dengan musuh
        self.mask = pygame.mask.from_surface(self.image)
        
        return scroll

    def draw(self, screen):
        screen.blit(pygame.transform.flip(self.image, self.flip, False), (self.rect.x - 12, self.rect.y - 5))