import telebot
import google.generativeai as genai
from io import BytesIO
from PIL import Image

# Configure API keys
TELEGRAM_BOT_TOKEN = "7609939981:AAHosOGJ4Of-QEy1jg95ZH7VYRKZcH3ewLo"
GEMINI_API_KEY = "AIzaSyDZkCC19ros6WZk7m6w6G7Zv7hRDuE8ocQ"

# Initialize Telegram bot
bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
text_model = genai.GenerativeModel("gemini-pro")
image_model = genai.GenerativeModel("gemini-pro-vision")

# Start command
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Hello! I am an AI chatbot powered by Gemini. You can ask me anything or generate images by typing: /image followed by a description.")

# Handle text messages
@bot.message_handler(func=lambda message: not message.text.startswith('/image'))
def chat_with_gemini(message):
    try:
        response = text_model.generate_content(message.text)
        bot.reply_to(message, response.text)
    except Exception as e:
        bot.reply_to(message, "Sorry, I encountered an error.")

# Handle image generation
@bot.message_handler(commands=['image'])
def generate_image(message):
    prompt = message.text.replace("/image", "").strip()
    if not prompt:
        bot.reply_to(message, "Please provide a description. Example: /image A futuristic city at night.")
        return
    
    try:
        response = image_model.generate_content(prompt)
        image_data = response.image  # Get the generated image

        if image_data:
            image_bytes = BytesIO(image_data)
            image = Image.open(image_bytes)
            image.save("generated_image.png")

            with open("generated_image.png", "rb") as img:
                bot.send_photo(message.chat.id, img, caption="Here is your generated image!")

        else:
            bot.reply_to(message, "Sorry, I couldn't generate an image.")

    except Exception as e:
        bot.reply_to(message, "Error generating image.")

# Run the bot
print("Bot is running...")
bot.infinity_polling()
