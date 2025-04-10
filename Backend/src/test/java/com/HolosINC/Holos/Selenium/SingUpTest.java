package com.HolosINC.Holos.Selenium;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.apache.commons.io.FileUtils;
import java.time.Duration;
import java.io.File;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SingUpTest {
  private WebDriver driver;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();
  JavascriptExecutor js;
  @Before
  public void setUp() throws Exception {
    System.setProperty("webdriver.chrome.driver", "C:\\Users\\Usuario\\Desktop\\Nueva carpeta\\chromedriver.exe");
    driver = new ChromeDriver();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(60));
    js = (JavascriptExecutor) driver;
  }

  @Test
  public void testUntitledTestCase() throws Exception {
    driver.get("http://localhost:8081/signup");
    driver.findElement(By.cssSelector("[data-testid='firstName']")).sendKeys("Ana");
    driver.findElement(By.cssSelector("[data-testid='email']")).sendKeys("ana@test.com");
    driver.findElement(By.cssSelector("[data-testid='username']")).sendKeys("anauser");
    driver.findElement(By.cssSelector("[data-testid='password']")).sendKeys("12345678");
    driver.findElement(By.cssSelector("[data-testid='confirmPassword']")).sendKeys("87654321");

    // Esperar que aparezca el texto de error
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement errorText = wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//*[contains(text(),'Las contraseñas no coinciden')]")
        )
    );
    assertTrue(errorText.isDisplayed());

      }
/*
      @Test
      public void testRegistroUsuario() throws InterruptedException {
          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
      
          driver.get("http://localhost:8081/signup");
          driver.findElement(By.cssSelector("[data-testid='firstName']")).sendKeys("Roberto");
          driver.findElement(By.cssSelector("[data-testid='lastName']")).sendKeys("Pérez López");
          driver.findElement(By.cssSelector("[data-testid='email']")).sendKeys("roberto@test.com");
          driver.findElement(By.cssSelector("[data-testid='username']")).sendKeys("robertoUser");
      
          driver.findElement(By.cssSelector("[data-testid='password']")).sendKeys("12345678");
          driver.findElement(By.cssSelector("[data-testid='confirmPassword']")).sendKeys("12345678");
      
          // Modificación importante: Elimina el click() y solo usa sendKeys()
          WebElement fileInput = driver.findElement(By.cssSelector("[data-testid='imageProfile']"));
          fileInput.sendKeys("RUTA/AL/ARCHIVO/DE/IMAGEN"); // Cambia esto por la ruta real de tu imagen
          Thread.sleep(3000);  // Espera opcional para visualización
      
          driver.findElement(By.cssSelector("[data-testid='acceptTerms']")).click();
          driver.findElement(By.cssSelector("[data-testid='signupButton']")).click();
          
          WebElement successMessage = wait.until(
              ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(),'Registro exitoso')]"))
          );
      
          assert successMessage.isDisplayed();
          driver.quit();
      }
    
 */
  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
