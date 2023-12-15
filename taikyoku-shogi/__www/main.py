# %%
text = ''
for j in range(30, 30 + 40 * 36, 40):
    for i in range(30, 30 + 40 * 36, 40):
        text += f'<rect x="{i}" y="{j}" width="40" height="40" fill="black" fill-opacity="0.5" visibility="hidden" id="black-{int((j-30)/40)}-{int((i-30)/40)}"/>\n'

for j in range(30, 30 + 40 * 36, 40):
    for i in range(30, 30 + 40 * 36, 40):
        text += f'<rect x="{i}" y="{j}" width="40" height="40" fill="#808080" fill-opacity="0.5" visibility="hidden" id="grey-{int((j-30)/40)}-{int((i-30)/40)}"/>\n'

for j in range(30, 30 + 40 * 36, 40):
    for i in range(30, 30 + 40 * 36, 40):
        text += f'<rect x="{i}" y="{j}" width="40" height="40" fill="white" fill-opacity="0.5" visibility="hidden" id="white-{int((j-30)/40)}-{int((i-30)/40)}"/>\n'

for j in range(30, 30 + 40 * 36, 40):
    for i in range(30, 30 + 40 * 36, 40):
        text += f'<rect x="{2.75 + i}" y="{2.75 + j}" width="34.5" height="34.5" stroke="#5A5A5A" stroke-opacity="0.29" stroke-width="5.5" visibility="hidden" id="highlight-{int((j-30)/40)}-{int((i-30)/40)}"/>\n'

for j in range(30, 30 + 40 * 36, 40):
    for i in range(30, 30 + 40 * 36, 40):
        text += f'<rect x="{i}" y="{j}" width="40" height="40" class="square" stroke="#271A0D" stroke-width="3" id="square-{int((j-30)/40)}-{int((i-30)/40)}"/>\n'


with open('text.txt', 'w') as f:
    f.write(text)

# %%
