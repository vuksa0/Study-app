from PIL import Image, ImageDraw

SIZE = 512
RADIUS = SIZE * 8 // 32  # proportional corner radius

img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Background: #F5F5F5 rounded rect
draw.rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=RADIUS, fill=(245, 245, 245, 255))

# 4-pointed sparkle star using cubic bezier approximation
# Points scaled from 32x32 viewBox to SIZE x SIZE
s = SIZE / 32

def pt(x, y):
    return (x * s, y * s)

# Draw the sparkle as a polygon approximation of the cubic bezier path
# M16 4 C16.5 13 19 15.5 28 16 C19 16.5 16.5 19 16 28 C15.5 19 13 16.5 4 16 C13 15.5 15.5 13 16 4Z
# We approximate each bezier segment with many points

def cubic_bezier(p0, p1, p2, p3, steps=60):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt**3*p0[0] + 3*mt**2*t*p1[0] + 3*mt*t**2*p2[0] + t**3*p3[0]
        y = mt**3*p0[1] + 3*mt**2*t*p1[1] + 3*mt*t**2*p2[1] + t**3*p3[1]
        pts.append((x * s, y * s))
    return pts

points = []
# Segment 1: M16 4 C16.5 13 19 15.5 28 16
points += cubic_bezier((16,4), (16.5,13), (19,15.5), (28,16))
# Segment 2: C19 16.5 16.5 19 16 28
points += cubic_bezier((28,16), (19,16.5), (16.5,19), (16,28))
# Segment 3: C15.5 19 13 16.5 4 16
points += cubic_bezier((16,28), (15.5,19), (13,16.5), (4,16))
# Segment 4: C13 15.5 15.5 13 16 4
points += cubic_bezier((4,16), (13,15.5), (15.5,13), (16,4))

draw.polygon(points, fill=(17, 17, 17, 255))

out = "C:/Users/vukzi/thinkio-logo.png"
img.save(out)
print(f"Saved: {out}")
