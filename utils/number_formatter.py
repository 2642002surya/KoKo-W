"""
Number formatting utility for displaying large numbers in abbreviated format
K → M → B → T → Qa → Qi → Sx → Sp → Oc
"""

def format_number(num):
    """
    Format numbers using the K/M/B/T/Qa/Qi/Sx/Sp/Oc system
    
    Args:
        num: The number to format (int or float)
    
    Returns:
        str: Formatted number string
    """
    if not isinstance(num, (int, float)):
        return str(num)
    
    if num < 0:
        return "-" + format_number(-num)
    
    # Handle small numbers (less than 1000)
    if num < 1000:
        if isinstance(num, float) and num != int(num):
            return f"{num:.1f}"
        return str(int(num))
    
    # Define the suffixes and their values
    suffixes = [
        (1_000_000_000_000_000_000_000_000_000, "Oc"),  # Octillion
        (1_000_000_000_000_000_000_000_000, "Sp"),      # Septillion
        (1_000_000_000_000_000_000_000, "Sx"),          # Sextillion
        (1_000_000_000_000_000_000, "Qi"),              # Quintillion
        (1_000_000_000_000_000, "Qa"),                  # Quadrillion
        (1_000_000_000_000, "T"),                       # Trillion
        (1_000_000_000, "B"),                           # Billion
        (1_000_000, "M"),                               # Million
        (1_000, "K"),                                   # Thousand
    ]
    
    # Find the appropriate suffix
    for value, suffix in suffixes:
        if num >= value:
            formatted_num = num / value
            
            # Format to 1 decimal place if not a whole number
            if formatted_num == int(formatted_num):
                return f"{int(formatted_num)}{suffix}"
            else:
                return f"{formatted_num:.1f}{suffix}"
    
    # Fallback (should never reach here with current logic)
    return str(int(num))

def format_with_commas(num):
    """
    Format numbers with commas for readability (fallback option)
    """
    if not isinstance(num, (int, float)):
        return str(num)
    
    if isinstance(num, float) and num != int(num):
        return f"{num:,.1f}"
    return f"{int(num):,}"

# Test the function if run directly
if __name__ == "__main__":
    test_numbers = [
        500, 1000, 1500, 1000000, 1500000, 2500000000, 
        1000000000000, 1500000000000000, 1200000000000000000,
        1000000000000000000000, 1500000000000000000000000000
    ]
    
    print("Testing number formatter:")
    for num in test_numbers:
        print(f"{num:,} → {format_number(num)}")