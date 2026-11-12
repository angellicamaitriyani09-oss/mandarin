import os
import random
from pathlib import Path

import pygame

from enemy import Enemy
from game_platform import Platform
from player import Player


SCREEN_WIDTH = 400
SCREEN_HEIGHT = 600
FPS = 60
SCROLL_THRESH = 200
GRAVITY = 1
MAX_PLATFORMS = 10

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"

pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Jumpy Game")
pygame.display.set_icon(pygame.image.load(ASSETS_DIR / "ghost.png"))
clock = pygame.time.Clock()

pygame.mixer.music.load(ASSETS_DIR / "bgm.wav")
pygame.mixer.music.set_volume(0.3)
pygame.mixer.music.play(-1)
jump_fx = pygame.mixer.Sound(ASSETS_DIR / "jump.wav")
death_fx = pygame.mixer.Sound(ASSETS_DIR / "death.wav")

font_small = pygame.font.SysFont("Lucida Sans", 20)
font_big = pygame.font.SysFont("Lucida Sans", 24)

jumpy_image = pygame.image.load(ASSETS_DIR / "bocchil.png").convert_alpha()
bg_image = pygame.image.load(ASSETS_DIR / "background.png").convert_alpha()
platform_image = pygame.image.load(ASSETS_DIR / "wood.png").convert_alpha()
bird_sheet = pygame.image.load(ASSETS_DIR / "bird.png").convert_alpha()

score_path = BASE_DIR / "score.txt"
if score_path.exists():
    try:
        high_score = int(score_path.read_text(encoding="utf-8").strip() or "0")
    except ValueError:
        high_score = 0
else:
    high_score = 0


def draw_text(text, font, text_color, x, y):
    image = font.render(text, True, text_color)
    screen.blit(image, (x, y))


def draw_background(scroll):
    screen.blit(bg_image, (0, scroll))
    screen.blit(bg_image, (0, scroll - SCREEN_HEIGHT))


def create_platform_group():
    group = pygame.sprite.Group()
    group.add(
        Platform(
            SCREEN_WIDTH // 2 - 50,
            SCREEN_HEIGHT - 5,
            100,
            False,
            platform_image,
        )
    )
    return group


def main():
    global high_score

    player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 150, jumpy_image)
    platform_group = create_platform_group()
    enemy_group = pygame.sprite.Group()
    score = 0
    scroll = 0
    bg_scroll = 0
    fade_counter = 0
    game_over = False
    running = True

    while running:
        clock.tick(FPS)
        restart_requested = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif game_over and event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    restart_requested = True

        if not running:
            break

        if not game_over:
            scroll = player.move(
                platform_group,
                SCREEN_WIDTH,
                GRAVITY,
                SCROLL_THRESH,
                jump_fx,
            )
            bg_scroll = (bg_scroll + scroll) % SCREEN_HEIGHT
            draw_background(bg_scroll)

            platform_group.update(scroll, SCREEN_WIDTH, SCREEN_HEIGHT)
            while len(platform_group) < MAX_PLATFORMS:
                top_platform = min(platform_group, key=lambda item: item.rect.top)
                width = random.randint(40, 60)
                x = random.randint(0, SCREEN_WIDTH - width)
                y = top_platform.rect.top - random.randint(80, 120)
                moving = score > 1000 and random.randint(1, 2) == 1
                platform_group.add(
                    Platform(x, y, width, moving, platform_image)
                )

            if len(enemy_group) == 0 and score > 2000:
                enemy_group.add(Enemy(SCREEN_WIDTH, 100, bird_sheet, 1.5))
            enemy_group.update(scroll, SCREEN_WIDTH)

            score += max(scroll, 0)
            marker_y = score - high_score + SCROLL_THRESH
            pygame.draw.line(
                screen,
                WHITE,
                (0, marker_y),
                (SCREEN_WIDTH, marker_y),
                3,
            )
            draw_text(
                "HIGH SCORE",
                font_small,
                WHITE,
                SCREEN_WIDTH - 130,
                marker_y,
            )

            platform_group.draw(screen)
            enemy_group.draw(screen)
            player.draw(screen)
            draw_text(f"SCORE : {score}", font_small, WHITE, 0, 0)

            hit_enemy = pygame.sprite.spritecollide(
                player, enemy_group, False, pygame.sprite.collide_mask
            )
            if player.rect.top > SCREEN_HEIGHT or hit_enemy:
                game_over = True
                death_fx.play()
                if score > high_score:
                    high_score = score
                    score_path.write_text(str(high_score), encoding="utf-8")
        else:
            draw_background(bg_scroll)
            if fade_counter < SCREEN_WIDTH:
                fade_counter = min(fade_counter + 5, SCREEN_WIDTH)
                for y in range(0, 6, 2):
                    pygame.draw.rect(screen, BLACK, (0, y * 100, fade_counter, 100))
                    pygame.draw.rect(
                        screen,
                        BLACK,
                        (SCREEN_WIDTH - fade_counter, (y + 1) * 100, fade_counter, 100),
                    )
            else:
                draw_text("GAME OVER!", font_big, WHITE, 130, 200)
                draw_text(f"SCORE : {score}", font_big, WHITE, 40, 300)
                draw_text("PRESS SPACE TO RESTART", font_small, WHITE, 70, 350)

            if restart_requested:
                player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 150, jumpy_image)
                platform_group = create_platform_group()
                enemy_group.empty()
                score = 0
                scroll = 0
                bg_scroll = 0
                fade_counter = 0
                game_over = False

        pygame.display.flip()

    pygame.quit()


if __name__ == "__main__":
    main()
