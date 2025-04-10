package com.HolosINC.Holos.Selenium;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class LoginTestSelenium {
  private WebDriver driver;
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
  public void testLoginIncorrecto() throws Exception {
    driver.get("http://localhost:8081/login");
    
    // Ingresar un usuario y contraseña incorrectos
    driver.findElement(By.cssSelector("[data-testid='username']")).sendKeys("usuarioInexistente");
    driver.findElement(By.cssSelector("[data-testid='password']")).sendKeys("12345678");
    driver.findElement(By.cssSelector("[data-testid='loginButton']")).click();

    // Esperar que aparezca el mensaje de error
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement errorMessage = wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//*[contains(text(),'Credenciales incorrectas')]")
        )
    );

    assertTrue(errorMessage.isDisplayed());
  }

  @Test
  public void testLoginCorrecto() throws Exception {
    driver.get("http://localhost:8081/login");

    // Ingresar un usuario y contraseña correctos
    driver.findElement(By.cssSelector("[data-testid='username']")).sendKeys("artist1");
    driver.findElement(By.cssSelector("[data-testid='password']")).sendKeys("artist1@gmail.com");
    driver.findElement(By.cssSelector("[data-testid='loginButton']")).click();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    
     // 2. Abrir el drawer (menú desplegable)
     WebElement drawerButton = wait.until(
        ExpectedConditions.elementToBeClickable(
            By.cssSelector("[data-testid='drawerButtonId']")
        )
    );
    
    try {
        drawerButton.click();
    } catch (ElementClickInterceptedException e) {
        js.executeScript("arguments[0].click();", drawerButton);
    }

    WebElement usernameInput = wait.until(
    ExpectedConditions.visibilityOfElementLocated(
        By.cssSelector("[data-testid='username']")
    )
    );

    String displayedUsername = usernameInput.getAttribute("value");
    assertEquals("artist1", displayedUsername);

    // Verificación del campo de nombre
    WebElement nameInput = wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("[data-testid='nombre']")
        )
    );
    assertEquals("artist1", nameInput.getAttribute("value"));
    }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }
}
