package com.HolosINC.Holos.endToEnd;
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;

import java.io.File;
import java.time.Duration;
public class UploadAndReportWorkTests {
  private WebDriver driver;
  JavascriptExecutor js;
  @Before
public void setUp() {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();

    // Desactiva el password manager y avisos de seguridad
    options.addArguments("--disable-save-password-bubble");
    options.setExperimentalOption("prefs", new java.util.HashMap<String, Object>() {{
        put("credentials_enable_service", false);
        put("profile.password_manager_enabled", false);
    }});

    driver = new ChromeDriver(options);
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    js = (JavascriptExecutor) driver;
}

  @After
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void UploadAndReportWorkTest() {
    driver.get("http://localhost:8081/");
    driver.manage().window().setSize(new Dimension(1936, 1056));
    driver.findElement(By.cssSelector(".r-borderRadius-1dzdj1l")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r:nth-child(2) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("braulio");
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).sendKeys("braulioolmedo116@gmail.com");
    {
      WebElement element = driver.findElement(By.cssSelector(".r-cursor-1loqt21 > .css-view-175oi2r"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".r-cursor-1loqt21 > .css-view-175oi2r")).click();
    try {
      Thread.sleep(1000);
  } catch (InterruptedException e) {
      e.printStackTrace();
  }
    driver.findElement(By.cssSelector(".r-height-1472mwg > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(6) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(3)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(3)")).sendKeys("Frieren");
    driver.findElement(By.cssSelector(".r-height-o52ifk")).click();
    driver.findElement(By.cssSelector(".r-height-o52ifk")).sendKeys("Frieren");
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(7)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(7)")).sendKeys("85.49");
    driver.findElement(By.cssSelector(".r-height-4d76ec")).click();
    driver.findElement(By.cssSelector(".r-color-jwli3a:nth-child(2)")).click();
    WebElement inputFile = driver.findElement(By.cssSelector("input[type='file']"));
    js.executeScript("arguments[0].style.display = 'block';", inputFile);
    String absolutePath = new File("src/main/resources/static/images/abstract_art.jpg").getAbsolutePath();
    inputFile.sendKeys(absolutePath);


    driver.findElement(By.cssSelector(".r-backgroundColor-ythuku")).click(); 

    try {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        Alert alert = wait.until(ExpectedConditions.alertIsPresent()); // Espera explícitamente a que aparezca
        System.out.println("Texto de la alerta: " + alert.getText());
        alert.accept(); // Cierra la alerta
    } catch (Exception e) {
        System.out.println("No se encontró una alerta: " + e.getMessage());
    }
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    driver.findElement(By.cssSelector(".r-marginInline-1xpp3t0")).click();
    driver.findElement(By.cssSelector(".r-marginInline-1xpp3t0")).sendKeys("frie");
    driver.findElement(By.cssSelector(".r-marginInline-1xpp3t0")).sendKeys(Keys.ENTER);
    driver.findElement(By.cssSelector(".r-height-atnv13 > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .css-text-146c3p1:nth-child(2)")).click();
    {
      WebElement element = driver.findElement(By.cssSelector(".r-marginBlock-bplmwz"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    driver.findElement(By.cssSelector(".r-marginBlock-bplmwz")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("emilio");
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(1)")).sendKeys("emilio.esp99@gmail.com");
    driver.findElement(By.cssSelector(".r-cursor-1loqt21 > .css-view-175oi2r")).click();
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).click();
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).sendKeys("frier");
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze")).sendKeys(Keys.ENTER);
    driver.findElement(By.cssSelector(".r-height-atnv13 > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".r-backgroundColor-1nhdpw0 > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".r-fontSize-1b43r93:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(6)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(6)")).sendKeys("Se trata de un dibujo ofensivo ");
    driver.findElement(By.cssSelector(".r-zIndex-1sg8ghl")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .r-transitionProperty-1i6wzkk > .r-color-cqee49")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(10)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(10)")).sendKeys("Se trata de un dibujo ofensivo");
    driver.findElement(By.cssSelector(".r-backgroundColor-evrpwi > .css-text-146c3p1")).click();
    try {
      WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
      Alert alert = wait.until(ExpectedConditions.alertIsPresent()); // Espera explícitamente a que aparezca
      System.out.println("Texto de la alerta: " + alert.getText());
      alert.accept(); // Cierra la alerta
  } catch (Exception e) {
      System.out.println("No se encontró una alerta: " + e.getMessage());
  }
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
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
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).click();
    driver.findElement(By.cssSelector(".css-textinput-11aywtz:nth-child(2)")).sendKeys("admin1");
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).click();
    driver.findElement(By.cssSelector(".r-borderColor-1i8giiy:nth-child(1)")).sendKeys("admin1@gmail.com");
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(2) > .css-view-175oi2r > .css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r:nth-child(1) > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-view-175oi2r > .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".r-backgroundColor-s53p2z:nth-child(3)")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(6) > .css-view-175oi2r > .r-fontSize-1i10wst")).click();
    driver.findElement(By.cssSelector(".r-backgroundColor-13wxgls > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(12) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(5) .css-accessibilityImage-9pa8cd")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(4) > .css-view-175oi2r > .css-view-175oi2r:nth-child(3) > .css-view-175oi2r > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".r-borderRadius-1xfd6ze:nth-child(3) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".r-paddingBlock-11f147o:nth-child(3) > .css-text-146c3p1")).click();
    driver.findElement(By.cssSelector(".css-view-175oi2r:nth-child(3) > .r-transitionProperty-1i6wzkk > .r-fontSize-1i10wst")).click();
   
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    WebElement title = wait.until(ExpectedConditions.visibilityOfElementLocated(
  By.cssSelector("[data-testid='title']")
));
    System.out.println("Texto del título: " + title.getText());
    String titleText = title.getText();

    assertEquals("Título: Se trata de un dibujo ofensivo ", titleText);
    }
}
