using Microsoft.EntityFrameworkCore;
using AmazonDataAnalytics.API.Data;
using DotNetEnv;

// Load .env.local BEFORE creating builder
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add environment variables
builder.Configuration.AddEnvironmentVariables();

// Lấy connection string từ biến môi trường .env
var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
Console.WriteLine($"Connection String: {connectionString}");

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext with detailed logging
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString,
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        });
    options.EnableSensitiveDataLogging(); // Enable detailed logging
    options.EnableDetailedErrors(); // Enable detailed error messages
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run(); 