package com.HolosINC.Holos.Selenium;

import java.util.regex.Pattern;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import org.openqa.selenium.interactions.Actions;
/*
public class ReportAdminTest {
private WebDriver driver;
  private StringBuffer verificationErrors = new StringBuffer();
  JavascriptExecutor js;
  private Actions actions;

  @Before
  public void setUp() throws Exception {
    System.setProperty("webdriver.chrome.driver", "C:\\Users\\Usuario\\Desktop\\Nueva carpeta\\chromedriver.exe");
    driver = new ChromeDriver();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(60));
    js = (JavascriptExecutor) driver;
    actions = new Actions(driver);
  }
    @Test
    public void testAdminCanViewReports() throws Exception {
        driver.get("http://localhost:8081/login");
        driver.manage().window().maximize();
        // Ingresar un usuario y contraseña correctos
        driver.findElement(By.cssSelector("[data-testid='username']")).sendKeys("admin1");
        driver.findElement(By.cssSelector("[data-testid='password']")).sendKeys("admin1@gmail.com");
        driver.findElement(By.cssSelector("[data-testid='loginButton']")).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        actions.moveByOffset(20, 30).click().perform();
        Thread.sleep(50);
        actions.moveByOffset(95,230).click().perform();
    }

    @Test
    public void testAdminCanFilterReports() {
       
    }

    @Test
    public void testAdminCanDownloadReport() {
        
    }
} */