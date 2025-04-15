package com.HolosINC.Holos;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import java.util.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
public class CommissionEndToEndTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;
  @Before
  public void setUp() {
    WebDriverManager.chromedriver().setup();
    driver = new ChromeDriver();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(60));
    js = (JavascriptExecutor) driver;
  }
  @After
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void CommissionEndToEndTest() {
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
    driver.findElement(By.cssSelector(".r-alignSelf-1kihuf0")).click();
    driver.findElement(By.cssSelector(".r-verticalAlign-ad9o1y:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".r-verticalAlign-ad9o1y:nth-child(1)")).sendKeys("Cuadro spiderman");
    driver.findElement(By.cssSelector(".r-minHeight-h3f8nf")).click();
    driver.findElement(By.cssSelector(".r-minHeight-h3f8nf")).sendKeys("Quiero un cuadro de spiderman dando una voltereta");
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(3)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(3)")).sendKeys("140");
    driver.findElement(By.cssSelector("input:nth-child(5)")).click();
    driver.findElement(By.cssSelector("input:nth-child(5)")).click();
    driver.findElement(By.cssSelector("input:nth-child(5)")).sendKeys("19/04/2027");
    driver.findElement(By.cssSelector(".r-padding-edyy15")).click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
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
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(5) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(6) > .css-view-175oi2r:nth-child(3) .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-text-146c3p1:nth-child(2)")).click();
    
    {
      WebElement element = driver.findElement(By.cssSelector(".r-marginBlock-bplmwz"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".r-marginBlock-bplmwz")).click();
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
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
    inputField.sendKeys(Keys.chord(Keys.CONTROL, "a")); // Seleccionar todo
    inputField.sendKeys(Keys.DELETE); // Esto limpia el campo
    inputField.sendKeys("150"); // Luego introduces el nuevo valor
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r")).click();
    wait.until(ExpectedConditions.alertIsPresent());  // Espera hasta que la alerta esté presente
    //assertThat(driver.switchTo().alert().getText(), is("Precio actualizado con éxito"));
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
    driver.findElement(By.cssSelector(".r-marginBlock-bplmwz")).click();
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
    //assertThat(driver.switchTo().alert().getText(), is("Comisión aceptada"));
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
    driver.switchTo().defaultContent();
    //driver.findElement(By.cssSelector(".r-backgroundColor-oe20jz > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector("[data-testid='pay-button']")).click();
  }
}
