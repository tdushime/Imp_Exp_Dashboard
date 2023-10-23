# Packages for API
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import wbgapi as wb

# Packages for webscraping
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

os.environ['PATH'] += r"C:/SeleniumDrivers/"

#url = "https://tradestat.commerce.gov.in/eidb"
ind_exports = "https://tradestat.commerce.gov.in/eidb/ecntq.asp"
ind_imports = "https://tradestat.commerce.gov.in/eidb/icntq.asp"

india_exports = {'country': 'IND'}
india_imports = {'country': 'IND'}
years = ["2015", "2016", "2017", "2018", "2019", "2020"]

# Open the webpage
driver = webdriver.Chrome()
driver.get(ind_exports)
for year in years:
    try:
        # Find the year select element and select the option with value "2020"
        year_select = WebDriverWait(driver,50).until(
            EC.presence_of_element_located((By.ID, "select2"))
        )
        #driver.find_element(By.ID, "select2")
        year_select.find_element(By.CSS_SELECTOR, f"option[value='{year}']").click()

        # Click the radio button with the "onclick" attribute set to "checkusd"
        usd_radio = driver.find_element(By.NAME, "radiousd")
        usd_radio.click()

        # Find and click the submit button
        submit_button = driver.find_element(By.ID, "button1")
        submit_button.click()

        # Check if a table is present on the next page by looking for a table element
        table = driver.find_element(By.TAG_NAME, "table")
        rows = table.find_elements(By.TAG_NAME, "tr")

        if len(rows) > 0:
            # Print the last row
            last_row = rows[-1]
            row_cells = last_row.find_elements(By.TAG_NAME, "td")
            yr = int(year)
            Tot = float(row_cells[4].text.replace(',', ''))*1000000
            print(type(yr), type(Tot))
            india_exports[yr]=Tot
            #for cell in row_cells:
            #    print(cell.text)
        else:
            print("No table found on the next page.")
        
        driver.back()

    except Exception as e:
        print("An error occurred for the year {year}:", str(e))

# Close the WebDriver
driver.quit()

# Open the webpage
driver = webdriver.Chrome()
driver.get(ind_imports)
years = ["2015", "2016", "2017", "2018", "2019", "2020"]
for year in years:
    try:
        # Find the year select element and select the option with value "2020"
        year_select = WebDriverWait(driver,50).until(
            EC.presence_of_element_located((By.ID, "select2"))
        )
        #driver.find_element(By.ID, "select2")
        year_select.find_element(By.CSS_SELECTOR, f"option[value='{year}']").click()

        # Click the radio button with the "onclick" attribute set to "checkusd"
        usd_radio = driver.find_element(By.NAME, "radiousd")
        usd_radio.click()

        # Find and click the submit button
        submit_button = driver.find_element(By.ID, "button1")
        submit_button.click()

        # Check if a table is present on the next page by looking for a table element
        table = driver.find_element(By.TAG_NAME, "table")
        rows = table.find_elements(By.TAG_NAME, "tr")

        if len(rows) > 0:
            # Print the last row
            last_row = rows[-1]
            row_cells = last_row.find_elements(By.TAG_NAME, "td")
            yr = int(year)
            Tot = float(row_cells[4].text.replace(',', ''))*1000000
            india_imports[yr]=Tot
            #for cell in row_cells:
            #    print(cell.text)
        else:
            print("No table found on the next page.")
        
        driver.back()

    except Exception as e:
        print("An error occurred for the year {year}:", str(e))

# Close the WebDriver
driver.quit()

# WORLD BANK DATA

# Exports
exports = wb.data.DataFrame('BX.GSR.TOTL.CD', ["USA", "MEX", "GHA", "THA", "PAN", "QAT"], range(2015, 2021), numericTimeKeys=True)
exports.reset_index(inplace=True)
exports.rename(columns={'economy':'country'}, inplace=True)
exports

# Imports
imports = wb.data.DataFrame('BM.GSR.TOTL.CD', ["USA", "MEX", "GHA", "THA", "PAN", "QAT"], range(2015, 2021), numericTimeKeys=True)
imports.reset_index(inplace=True)
imports.rename(columns={'economy':'country'}, inplace=True)
imports

# Add india data
exports = exports.append(india_exports, ignore_index=True)
imports = imports.append(india_imports, ignore_index=True)

print("Exports: ")
print(exports)
print("imports: ")
print(imports)
exports.to_csv("C:\\Users\\Consultant\\Desktop\\React\\exports.csv", index=False)
imports.to_csv("C:\\Users\\Consultant\\Desktop\\React\\imports.csv", index=False)
