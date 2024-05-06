package test1.visual;


import java.time.Duration;

//import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.applitools.eyes.RectangleSize;
import com.applitools.eyes.selenium.Eyes;
import com.applitools.eyes.selenium.fluent.Target;


/**
 * Hello world!
 *
 */
public class App 
{
    WebDriver driver;
    Eyes eyes;
   

    @BeforeTest
    public void beforeEach() {
    	eyes = new Eyes();
    	
		eyes.setApiKey("Snllk6rtxICl4TafQpIROk3ApeOra111uC99GHfakzRuFg110");
		System.setProperty("webdriver.chrome.driver", "/users/sharanya/Documents/chromedriver");
        driver = new ChromeDriver();
        eyes.open(driver,
        		  "PersonalBudget Testing",
        		  "First test Case", new RectangleSize(800, 600)
        		  );
    }
    @Test
    public void myTestCase() {
        driver.get("http://localhost:3000/login");
        
        eyes.check(Target.window());
        driver.findElement(By.id("username")).sendKeys("sg");
        driver.findElement(By.id("password")).sendKeys("12");
        driver.findElement(By.id("login")).click();
        driver.findElement(By.id("logout")).click();
        eyes.check(Target.window());
    }

    @AfterTest
    public void afterEach() {
    	eyes.closeAsync();
        driver.close();
    }
}
