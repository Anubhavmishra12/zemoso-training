import heapq
from collections import defaultdict

message = "Hello Brother"

freq_dict = defaultdict(int)
for char in message:
    freq_dict[char] += 1

heap = [[freq, [char, ""]] for char, freq in freq_dict.items()]
heapq.heapify(heap)

while len(heap) > 1:
    lo = heapq.heappop(heap)
    hi = heapq.heappop(heap)
    for pair in lo[1:]:
        pair[1] = '0' + pair[1]
    for pair in hi[1:]:
        pair[1] = '1' + pair[1]
    heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])

huff_dict = dict(heapq.heappop(heap)[1:])

encrypted_message = "".join([huff_dict[char] for char in message])

print("Encrypted Message:", encrypted_message)
print("Huffman Code Dictionary:", huff_dict)