import random
import time

letters = 'abcdefghijklmnñopqrstuvwxyz'
numbers = '1234567890'
symbols = '!_?¿¡#$%'


def main() -> None:
    lettersQuantity = int(input("how many letters? "))
    numbersQuantity = int(input("how many numbers? "))
    symbolsQuantity = int(input("how many symbols? "))
    totalLength = lettersQuantity + numbersQuantity + symbolsQuantity

    password = ""
    upperCase = False
    while len(password) < totalLength:

        selection = random.randint(1, 3)
        char = ''
        if selection == 1 and lettersQuantity > 0:
            idx = random.randint(0, len(letters) - 1)
            char = letters[idx]
            if random.randint(0, 10) < 5 or (lettersQuantity == 1 and not (upperCase)):
                char = char.upper()
                upperCase = True

            lettersQuantity -= 1

        if selection == 2 and numbersQuantity > 0:
            idx = random.randint(0, len(numbers) - 1)
            char = numbers[idx]
            numbersQuantity -= 1

        if selection == 3 and symbolsQuantity > 0:
            idx = random.randint(0, len(symbols) - 1)
            char = symbols[idx]
            symbolsQuantity -= 1

        password += char
    print("password: " + password)


if __name__ == '__main__':
    main()
