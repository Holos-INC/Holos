package com.HolosINC.Holos.endToEnd;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;
import static org.junit.Assert.assertEquals;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import java.time.Duration;

public class CreateAndAcceptCommissionTests {
  private WebDriver driver;
  JavascriptExecutor js;
  @Before
  public void setUp() {
    WebDriverManager.chromedriver().setup();
    driver = new ChromeDriver();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    js = (JavascriptExecutor) driver;
  }
  @After
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void CreateAndAcceptCommissionTest() {
    driver.get("http://localhost:8081/");
    driver.manage().window().setSize(new Dimension(1936, 1056));
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector("svg:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("emilio");
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).sendKeys("emilio.esp99@gmail.com");
    {
      WebElement element = driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r")).click();
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).click();
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).sendKeys("braul");
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).sendKeys(Keys.ENTER);
    driver.findElement(By.cssSelector(".r-height-7r4507 > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".r-marginBlock-bplmwz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-8n6xh2:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-8n6xh2:nth-child(2)")).sendKeys("Cuadro spiderman");
    driver.findElement(By.cssSelector(".r-minHeight-1aplaab")).click();
    driver.findElement(By.cssSelector(".r-minHeight-1aplaab")).sendKeys("Quiero un cuadro de spiderman dando una voltereta");
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(7)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(7)")).sendKeys("140");
    driver.findElement(By.cssSelector("input:nth-child(9)")).click();
    driver.findElement(By.cssSelector("input:nth-child(9)")).click();
    driver.findElement(By.cssSelector("input:nth-child(9)")).sendKeys("19/04/2027");
    driver.findElement(By.cssSelector(".r-backgroundColor-ythuku")).click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.alertIsPresent());  // Espera hasta que la alerta esté presente

    try {
        Alert alert = driver.switchTo().alert();  // Cambiar al contexto de la alerta
        System.out.println("Texto de la alerta: " + alert.getText());  // Obtener el texto de la alerta
        alert.accept();  // Aceptar la alerta
    } catch (Exception e) {
        System.out.println("No hay alerta presente.");
    }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(5) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(6) > .css-view-175oi2r:nth-child(3) .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    
    {
      WebElement element = driver.findElement(By.cssSelector(".r-transitionProperty-1i6wzkk:nth-child(3)"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".r-transitionProperty-1i6wzkk:nth-child(3)")).click();
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r:nth-child(3) > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r:nth-child(1) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r:nth-child(2) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("braulio");
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).sendKeys("braulioolmedo116@gmail.com");
    {
      WebElement element = driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r")).click();
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    driver.findElement(By.cssSelector(".r-height-1472mwg > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(5) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(7) > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".r-margin-5scogr > .css-view-175oi2r")).click();
    WebElement inputField = driver.findElement(By.cssSelector(".r-flexGrow-16y2uox > .css-textinput-11aywtz"));
    inputField.click();
    inputField.sendKeys(Keys.chord(Keys.CONTROL, "a")); 
    inputField.sendKeys(Keys.DELETE); 
    inputField.sendKeys("150"); 
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r")).click();
    wait.until(ExpectedConditions.alertIsPresent());  // Espera hasta que la alerta esté presente
    try {
      // Interactuar con la alerta
      Alert alert = driver.switchTo().alert();  // Cambiar al contexto de la alerta
      System.out.println("Texto de la alerta: " + alert.getText());  // Obtener el texto de la alerta
      alert.accept();  // Aceptar la alerta
  } catch (Exception e) {
      System.out.println("No hay alerta presente.");
  }
  
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-text-146c3p1:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".r-color-jwli3a")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("emilio");
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(1)")).sendKeys("emilio.esp99@gmail.com");
    {
      WebElement element = driver.findElement(By.cssSelector(".r-marginBlock-15a3drq"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".r-marginBlock-15a3drq")).click();
    try {
      Thread.sleep(1000);
  } catch (InterruptedException e) {
      e.printStackTrace();
  }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(5) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(6) > .css-view-175oi2r:nth-child(3) .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    wait.until(ExpectedConditions.alertIsPresent());  // Espera hasta que la alerta esté presente
    try {
      // Interactuar con la alerta
      Alert alert = driver.switchTo().alert();  // Cambiar al contexto de la alerta
      System.out.println("Texto de la alerta: " + alert.getText());  // Obtener el texto de la alerta
      alert.accept();  // Aceptar la alerta
  } catch (Exception e) {
      System.out.println("No hay alerta presente.");
  }
    driver.findElement(By.cssSelector(".r-backgroundColor-17dhdk8 > .css-text-146c3p1")).click();
    WebElement iframe = wait.until(ExpectedConditions.presenceOfElementLocated(
    By.cssSelector("iframe[name^='__privateStripeFrame']") // Stripe usa nombres aleatorios que empiezan con __private
));

    driver.switchTo().frame(iframe);
    WebElement cardNumberInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.cssSelector("input[name='cardnumber']")
));
cardNumberInput.sendKeys("4242424242424242");

WebElement expInput = driver.findElement(By.name("exp-date"));
expInput.sendKeys("1230");

WebElement cvcInput = driver.findElement(By.name("cvc"));
cvcInput.sendKeys("123");

WebElement zipInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.name("postal") // o "postalCode" si ese es el name exacto
));
zipInput.sendKeys("12345");

driver.switchTo().defaultContent();

driver.findElement(By.cssSelector("[data-testid='pay-button']")).click();
WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
  By.cssSelector("[data-testid='success-text']")
));

String successText = successMessage.getText();
assertEquals("¡Pago realizado con éxito! 🎉", successText);
  }
}
